import { StringUtils } from './string-utils';

describe('StringUtils', () => {
    describe('pad', () => {
        describe('valid inputs', () => {
            it('Default arguments', () => {
                expect(StringUtils.pad(2)).toBe('02');
            });
            it('Default arguments 2', () => {
                expect(StringUtils.pad(22)).toBe('22');
            });
            it ('Default arguments 3', () => {
                expect(StringUtils.pad(232)).toBe('232');
            });
            it('Custom pad character', () => {
                expect(StringUtils.pad(2, '#')).toBe('#2');
            });
        });
        describe('invalid values', () => {
            it('Default arguments', () => {
                expect(StringUtils.pad('2' as any)).toBe('02');
            });
            it('Custom pad character of length > 1', () => {
                expect(StringUtils.pad(2, '@@')).toBe('@2');
            });
            it('Null pad character', () => {
                expect(StringUtils.pad(2, null)).toBe('02');
            });
            it('Pad character of non string type: object', () => {
                expect(StringUtils.pad(2, {} as any)).toBe('02');
            });
            it('Pad character of non string type: number', () => {
                expect(StringUtils.pad(2, 2 as any)).toBe('02');
            });
        });
    });
});