const lookup = [
    {value: 1, binaryValue: 1, symbol: ""},
    {value: 1e3, binaryValue: 1024, symbol: "K"},
    {value: 1e6, binaryValue: Math.pow(1024, 2), symbol: "M"},
    {value: 1e9, binaryValue: Math.pow(1024, 3), symbol: "G"},
    {value: 1e12, binaryValue: Math.pow(1024, 4), symbol: "T"},
    {value: 1e15, binaryValue: Math.pow(1024, 5), symbol: "P"},
    {value: 1e18, binaryValue: Math.pow(1024, 6), symbol: "E"}
];

export function number(num: number, option?: { fractionDigits?: number, binaryMode?: boolean }) {

    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup.slice().reverse().find(item => num >= item.value);
    const _number = item ? (num / (option?.binaryMode ? item.binaryValue : item.value))
        .toFixed(option?.fractionDigits)
        .replace(rx, "$1") : 0
    return {
        number: _number,
        symbol: item?.symbol,
        join: () => `${_number}${item?.symbol ? ` ${item?.symbol}` : ''}`
    }
}

const humanize = {number}

export default humanize