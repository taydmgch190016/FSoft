import account from '../models/account.model';

export function findOneAccount(searchObj) {
  return account.findOne(searchObj).populate('categoryId')
}

