import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ItemRepository } from 'src/item/repositories/item.repository';
import { MemberRepository } from 'src/member/repositories/member.repository';
import { Shop } from 'src/shop/entities/shop.entity';
import { ShopRepository } from 'src/shop/repositories/shop.repository';
import { In, IsNull } from 'typeorm';
import {
  AddMemberToTransactionInputDTO,
  TransactionCreateInputDTO,
  TransactionEditInputDTO,
} from '../dtos/transaction-input.dto';
import { TransactionOutputDTO } from '../dtos/transaction-output.dto';
import { Transaction } from '../entities/transaction.entity';
import { TransactionItemRepository } from '../repositories/transaction-item.repository';
import { TransactionRepository } from '../repositories/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly trxRepo: TransactionRepository,
    private readonly itemRepo: ItemRepository,
    private readonly trxItemRepo: TransactionItemRepository,
    private readonly shopRepo: ShopRepository,
    private readonly memberRepo: MemberRepository,
  ) {}
  // get all transactions by date
  // create a new transaction

  public async createNewTransaction(
    input: TransactionCreateInputDTO,
  ): Promise<TransactionOutputDTO> {
    console.log(input);
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
  ): Promise<TransactionOutputDTO[]> {
    const member = await this.memberRepo.findOne({
      where: { cardNo, stoppedAt: IsNull() },
    });
    console.log(cardNo, member);
    if (!member) throw new NotFoundException('Memmber tidak ditemukan');
    const trxs = await this.trxRepo.find({
      relations: ['member'],
      where: {
        memberId: member.id,
      },
    });
    console.log(trxs.length);
    return plainToInstance(TransactionOutputDTO, trxs);
  }

  // close a transaction

  public async getShopByCTX(): Promise<Shop> {
    return await this.shopRepo.findOne({ where: { id: 1 } });
  }
}
