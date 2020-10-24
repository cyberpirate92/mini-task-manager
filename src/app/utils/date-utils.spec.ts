import { DateUtils } from './date-utils';
const tests = [{
        description: 'isDate',
        method: DateUtils.isDate,
        tests: [{
                description: 'Valid date object',
                input: [new Date()],
                expected: true
            },{
                description: 'Invalid date object',
                input: [new Date(NaN)],
                expected: false,
            }, {
                description: 'Null value',
                input: [null],
                expected: false,
            },{
                description: 'Undefined value',
                input: [undefined],
                expected: false,
            },{
                description: 'Non Empty String value',
                input: ['something'],
                expected: false,
            },{
                description: 'Empty string value',
                input: [''],
                expected: false,
            },{
                description: 'Non date Object',
                input: [{ x: 1}],
                expected: false,
            },
        ]
    },{
        description: 'fromResponseFormat',
        method: DateUtils.fromResponseFormat,
        tests: [{ 
                description: 'Correct date format',
                input: ["2020-10-13 12:00:00"], 
                expected: new Date(2020, 9, 13, 12, 0, 0),
            },{
                description: 'Incorrect date format',
                input: ['2020 10 13 12:00:00'],
                expected: null
            },{
                description: 'No Padding zeros',
                input: ["2020-9-4 1:2:3"],
                expected: new Date(2020, 8, 4, 1, 2, 3),
            },{
                description: 'No Padding zero for month',
                input: ["2020-9-04 01:02:03"],
                expected: new Date(2020, 8, 4, 1, 2, 3),
            },{
                description: 'No Padding zero for day',
                input: ["2020-09-4 01:02:03"],
                expected: new Date(2020, 8, 4, 1, 2, 3),
            },{
                description: 'No Padding zero for hour',
                input: ["2020-9-04 1:02:03"],
                expected: new Date(2020, 8, 4, 1, 2, 3),
            },{
                description: 'No Padding zero for minutes',
                input: ["2020-9-04 01:2:03"],
                expected: new Date(2020, 8, 4, 1, 2, 3),
            },{
                description: 'No Padding zero for minutes',
                input: ["2020-9-04 1:02:3"],
                expected: new Date(2020, 8, 4, 1, 2, 3),
            },{
                description: 'Null input',
                input: [null],
                expected: null,
            },{
                description: 'undefined input',
                input: [undefined],
                expected: null,
            },{
                description: 'Non String input: Object',
                input: [{ date: "2020-9-04 1:02:3" }],
                expected: null,
            },{
                description: 'Non String value: Date',
                input: [new Date()],
                expected: null,
            },{
                description: 'Zero length Empty string',
                input: [''],
                expected: null,
            },{
                description: 'String with only spaces',
                input: ['      '],
                expected: null,
            },
        ]
    }, {
        description: 'toRequestFormat',
        method: DateUtils.toRequestFormat,
        tests: [{
                description: 'Valid date object',
                input: [new Date(2020, 9, 13, 12, 0, 0)], 
                expected: "2020-10-13 12:00:00",
            },{
                description: 'Invalid date object',
                input: [new Date(NaN)],
                expected: '',
            },{
                description: 'Non Date Object: Object',
                input: [{ a: 1 }],
                expected: '',
            },{
                description: 'Non Date Object: Number',
                input: [299],
                expected: '',
            },{
                description: 'Non Date Object: string',
                input: ['2020-10-13 12:00:00'],
                expected: '',
            },
        ]
    }
];

describe('DateUtils', () => {
    tests.forEach(d => {
        describe(d.description, () => {
            d.tests.forEach(test => {
                it(test.description, () => {
                    expect(d.method.apply(DateUtils, test.input)).toEqual(test.expected);
                })
            })
        });
    })
});