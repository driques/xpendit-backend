import { Clock } from '../../domain/ports/Clock';

export class FixedClock implements Clock {
    constructor(private readonly date: Date) { }
    now(): Date {
        return this.date;
    }
}
