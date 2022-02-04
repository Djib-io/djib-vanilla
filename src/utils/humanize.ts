const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
];

export function number(num: number, fractionDigits?: number) {

    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup.slice().reverse().find(item => num >= item.value);
    const _number = item ? (num / item.value).toFixed(fractionDigits).replace(rx, "$1") : 0
    return {
        number: _number,
        symbol: item?.symbol,
        join: () => `${_number}${item?.symbol ? ` ${item?.symbol}` : ''}`
    }
}

const humanize = { number }

export default humanize