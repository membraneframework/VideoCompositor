export function inputRefIntoRawId(inputRef) {
    if (inputRef.type == 'global') {
        return `global:${inputRef.id}`;
    }
    else {
        return `output-specific-input:${inputRef.id}:${inputRef.outputId}`;
    }
}
export function parseInputRef(rawId) {
    const split = rawId.split(':');
    if (split.length < 2) {
        throw new Error(`Invalid input ID. (${rawId})`);
    }
    else if (split[0] === 'global') {
        return {
            type: 'global',
            id: split.slice(1).join(),
        };
    }
    else if (split[0] === 'output-specific-input') {
        return {
            type: 'output-specific-input',
            id: Number(split[1]),
            outputId: split.slice(2).join(),
        };
    }
    else {
        throw new Error(`Unknown input type (${split[0]}).`);
    }
}
