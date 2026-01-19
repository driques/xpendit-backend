import { Clock } from '../../src/domain/ports/Clock';

export class FakeClock implements Clock {
  private currentTime: Date;

  constructor(initialTime: Date) {
    this.currentTime = initialTime;
  }

  now(): Date {
    return this.currentTime;
  }

  set(date: Date): void {
    this.currentTime = date;
  }

  advanceDays(days: number): void {
    this.currentTime = new Date(
      this.currentTime.getTime() +
      days * 24 * 60 * 60 * 1000,
    );
  }
}
