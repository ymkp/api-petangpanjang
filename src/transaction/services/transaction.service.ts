import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ItemRepository } from 'src/item/repositories/item.repository';
import { MemberRepository } from 'src/member/repositories/member.repository';
import { Shop } from 'src/shop/entities/shop.entity';
import { ShopRepository } from 'src/shop/repositories/shop.repository';
import { In } from 'typeorm';
import {
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

  // FIXME : kayane salah deh kaya gini
  public async editATransaction(
    input: TransactionEditInputDTO,
  ): Promise<TransactionOutputDTO> {
    const shop = await this.getShopByCTX();
    const transaction = await this.trxRepo.getById(input.id);
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

  public async getAllTransaction(): Promise<TransactionOutputDTO[]> {
    const ts = await this.trxRepo.find();
    return plainToInstance(TransactionOutputDTO, ts);
  }

  // close a transaction

  public async getShopByCTX(): Promise<Shop> {
    return await this.shopRepo.findOne({ where: { id: 1 } });
  }
}
