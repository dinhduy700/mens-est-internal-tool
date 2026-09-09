export enum Blocker {
  ALL = 'ALL',
  NO = 0,
  YES = 1,
}

export const BlockerOptions = [
  { value: Blocker.ALL, label: 'Tất cả' },
  { value: Blocker.NO, label: 'Task không bị block' },
  { value: Blocker.YES, label: 'Task bị block' },
];
