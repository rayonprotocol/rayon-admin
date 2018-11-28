export enum RewardCycle {
  DAILY = 'd',
  WEEKLY = 'w',
  MONTHLY = 'm',
  ANNUALLY = 'a',
};

export enum RewardCycleName {
  d = 'DAILY',
  w = 'WEEKLY',
  m = 'MONTHLY',
  a = 'ANNUALLY',
};

export interface PersonalDataCategory {
  code: number;
  category1: string;
  category2: string;
  category3: string;
  borrowerAppAddress: string;
  score: number;
  rewardCycle: RewardCycle;
  updatedEpochTime: number;
  updatedDate: string;
}

export interface PersonalDataItem {
  borrowerAddress: string;
  code: number;
  dataHash: string;
  borrowerAppAddress: string;
  updatedEpochTime: number;
  updatedDate: string;
}

// Derived models

export interface PersonalDataItemWithCategory extends PersonalDataItem {
  category: PersonalDataCategory;
}