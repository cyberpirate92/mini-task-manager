export class StringUtils {
    /**
     * Prepend given number with specified padding character to a specified minimum length
     * 
     * @param value The numeric value to be padded
     * @param padCharacter The character to be used for padding
     * @param length pad value until this length
     * 
     * @returns the padded string
     */
    public static pad(value: number, padCharacter: string = '0', length: number = 2): string {
        if (isNaN(value)) {
            return value as any;
        }

        if (typeof padCharacter !== 'string') {
            padCharacter = '0';
        }
        
        let valStr = value.toString();
        if (valStr.length >= length) {
            return valStr;
        }
        
        const padding = new Array(length - valStr.length);
        return padding.fill(padCharacter.charAt(0)).join('') + valStr;
    }
}