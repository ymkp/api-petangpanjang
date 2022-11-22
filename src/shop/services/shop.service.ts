import { Injectable } from '@nestjs/common';
import { ShopRepository } from '../repositories/shop.repository';

@Injectable()
export class ShopService {
  constructor(private readonly shopRepo: ShopRepository) {}
}
