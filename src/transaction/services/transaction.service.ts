import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ItemRepository } from 'src/item/repositories/item.repository';
import { MemberCardRepository } from 'src/member/repositories/member-card.repository';
import { MemberRepository } from 'src/member/repositories/member.repository';
import { Shop } from 'src/shop/entities/shop.entity';
import { ShopRepository } from 'src/shop/repositories/shop.repository';
import { In, IsNull } from 'typeorm';
import {
  AddMemberToTransactionInputDTO,
  TransactionCreateInputDTO,
  TransactionPayInputDTO,
} from '../dtos/transaction-input.dto';
import {
  TransactionOutputDTO,
  TransactionOutputMiniDTO,
} from '../dtos/transaction-output.dto';
import { TransactionItemRepository } from '../repositories/transaction-item.repository';
import { TransactionMemberRecapRepository } from '../repositories/transaction-member-recap.repository';
import { TransactionPaymentTypeRepository } from '../repositories/transaction-payment-type.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import { Member } from 'src/member/entities/member.entity';
import { BaseApiResponse } from 'src/shared/dtos/base-api-response.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly trxRepo: TransactionRepository,
    private readonly itemRepo: ItemRepository,
    private readonly trxItemRepo: TransactionItemRepository,
    private readonly shopRepo: ShopRepository,
    private readonly memberRepo: MemberRepository,
    private readonly trxMemberRecapRepo: TransactionMemberRecapRepository,
    private readonly trxPaymentTypeRepo: TransactionPaymentTypeRepository,
    private readonly cardRepo: MemberCardRepository,
  ) {}
  // get all transactions by date
  // create a new transaction

  public async createNewTransaction(
    input: TransactionCreateInputDTO,
  ): Promise<TransactionOutputDTO> {
    const shop = await this.getShopByCTX();
    const transaction = await this.trxRepo.save({
      shopId: 1,
    });
    const taxPctg = shop.tax;
    const servicePctg = shop.service;
    let txPrice = 0;
    let txTax = 0;
    let txTotal = 0;
    const items = await this.itemRepo.find({
      where: { id: In(input.data.map((d) => d.itemId)) },
    });
    for (let i = 0; i < input.data.length; i++) {
      const idx = items.findIndex((d) => d.id === input.data[i].itemId);
      if (idx >= 0) {
        const tax = Math.round((items[idx].price * taxPctg) / 100);
        const totalPrice = items[idx].price * input.data[i].itemQuantity;
        const totalTax = tax * input.data[i].itemQuantity;
        const total = totalPrice + totalTax;
        txPrice += totalPrice;
        txTax += totalTax;
        txTotal += total;
        const ti = await this.trxItemRepo.save({
          item: items[idx],
          transaction,
          name: items[idx].name,
          price: items[idx].price,
          tax,
          quantity: input.data[i].itemQuantity,
          totalPrice,
          totalTax,
          total,
        });
      }
    }
    transaction.price = txPrice;
    transaction.tax = txTax;
    transaction.taxPctg = taxPctg;
    transaction.service = Math.round(((txPrice + txTax) * servicePctg) / 100);
    transaction.servicePctg = servicePctg;
    transaction.total = transaction.service + txPrice + txTax;
    if (input.memberId) {
      const member = await this.memberRepo.getById(input.memberId);
      transaction.member = member;
    }
    await this.trxRepo.save(transaction);
    await this.recountTrxRecap(input.memberId);
    return plainToInstance(TransactionOutputDTO, transaction);
  }
  // edit a transaction

  public async addMemberToATransaction(
    input: AddMemberToTransactionInputDTO,
  ): Promise<TransactionOutputDTO> {
    const trx = await this.trxRepo.getById(input.id);
    const member = await this.memberRepo.getById(input.memberId);
    trx.member = member;
    await this.trxRepo.save(trx);
    return plainToInstance(TransactionOutputDTO, trx);
  }

  public async getAllTransaction(): Promise<TransactionOutputDTO[]> {
    const ts = await this.trxRepo.find({
      relations: ['member'],
    });
    return plainToInstance(TransactionOutputDTO, ts);
  }

  public async getAllTransactionByCardNo(
    cardNo: string,
  ): Promise<TransactionOutputMiniDTO[]> {
    const member = await this.memberRepo.findOne({
      where: { cardNo, stoppedAt: IsNull() },
    });
    if (!member) throw new NotFoundException('Memmber tidak ditemukan');
    const trxs = await this.trxRepo.find({
      relations: ['member'],
      where: {
        memberId: member.id,
      },
    });
    return plainToInstance(TransactionOutputMiniDTO, trxs);
  }

  public async getTransactionCoompleteDetailByCardNo(
    cardNo: string,
  ): Promise<Member> {
    const member = await this.memberRepo.findOne({
      where: { cardNo, stoppedAt: IsNull() },
      withDeleted: true,
      relations: [
        'card',
        'transactions',
        'transactions.items',
        'transactionRecap',
        'transactionRecap.paymentType',
      ],
    });
    if (!member) throw new NotFoundException('member tidak ditemukan');
    return member;
  }

  public async getTransactionCoompleteDetailByMemberId(
    id: number,
  ): Promise<Member> {
    const member = await this.memberRepo.findOne({
      where: { id },
      withDeleted: true,
      relations: [
        'card',
        'transactions',
        'transactions.items',
        'transactionRecap',
        'transactionRecap.paymentType',
      ],
    });
    if (!member) throw new NotFoundException('member tidak ditemukan');
    return member;
  }

  public async payCompleteTransaction(
    input: TransactionPayInputDTO,
  ): Promise<BaseApiResponse<string>> {
    const trxRecap = await this.trxMemberRecapRepo.findOne({
      where: { memberId: input.memberId, id: input.id },
    });
    if (!trxRecap) throw new NotFoundException('Transaksi tidak ditemukan');
    const paymentType = await this.trxPaymentTypeRepo.getById(
      input.paymentTypeId,
    );
    const change = trxRecap.total - input.paid;
    if (change < 0) throw new BadRequestException('Pembayaran tidak valid');

    // ? close transactions
    trxRecap.paid = input.paid;
    trxRecap.change = change;
    trxRecap.paymentType = paymentType;
    trxRecap.paymentAt = new Date(Date.now());
    await this.trxMemberRecapRepo.save(trxRecap);
    const trxs = await this.trxRepo.find({
      where: { memberId: input.memberId },
    });
    trxs.forEach((t) => {
      t.closedAt = new Date(Date.now());
    });
    await this.trxRepo.save(trxs);

    // ? close member
    const member = await this.memberRepo.getById(input.memberId);
    member.stoppedAt = new Date(Date.now());
    await this.memberRepo.save(member);
    const card = await this.cardRepo.getById(member.cardId);
    card.isAvailable = true;
    await this.cardRepo.save(card);
    return {
      data: 'ok',
      meta: {},
    };
  }

  // close a transaction

  public async getShopByCTX(): Promise<Shop> {
    return await this.shopRepo.findOne({ where: { id: 1 } });
  }

  private async recountTrxRecap(memberId: number) {
    const member = await this.memberRepo.findOne({
      select: ['id', 'transactionRecapId'],
      where: { id: memberId },
    });

    let trxRecap = await this.trxMemberRecapRepo.findOne({
      where: { memberId },
    });
    if (!trxRecap) {
      trxRecap = await this.trxMemberRecapRepo.save({
        price: 0,
        tax: 0,
        taxPctg: 0,
        service: 0,
        servicePctg: 0,
        total: 0,
        memberId,
      });
    }
    if (!member.transactionRecapId) {
      member.transactionRecapId = trxRecap.id;
      await this.memberRepo.save(member);
    }
    const trxs = await this.trxRepo.find({
      where: { memberId },
    });

    let price = 0;
    let tax = 0;
    let taxPctg = 0;
    let service = 0;
    let servicePctg = 0;
    let total = 0;
    trxs.forEach((t) => {
      price += t.price;
      tax += t.tax;
      taxPctg += t.taxPctg;
      service += t.service;
      servicePctg += t.servicePctg;
      total += t.total;
    });
    taxPctg = Math.round(taxPctg / trxs.length);
    servicePctg = Math.round(servicePctg / trxs.length);

    trxRecap.price = price;
    trxRecap.tax = tax;
    trxRecap.taxPctg = taxPctg;
    trxRecap.service = service;
    trxRecap.servicePctg = servicePctg;
    trxRecap.total = total;
    await this.trxMemberRecapRepo.save(trxRecap);
  }
}
