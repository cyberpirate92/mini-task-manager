import { Pipe } from "@angular/core";
import { StringUtils } from '../utils/string-utils';

@Pipe({
    name:'pad'
})
export class PadPipe {
    public transform(value: number, padCharacter: string = '0', length: number = 2): string {
        return StringUtils.pad(value, padCharacter, length);
    }
}