export function areInputRefsEqual(ref1, ref2) {
    const sameType = ref1.type === ref2.type;
    const sameId = ref1.id === ref2.id;
    if (ref1.type === 'output-local' && ref2.type === 'output-local') {
        return sameId && sameType && ref1.outputId === ref2.outputId;
    }
    else {
        return sameId && sameType;
    }
}
export function inputRefIntoRawId(inputRef) {
    if (inputRef.type == 'global') {
        return `global:${inputRef.id}`;
    }
    else {
        return `output-local:${inputRef.id}:${inputRef.outputId}`;
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
    else if (split[0] === 'output-local') {
        return {
            type: 'output-local',
            id: Number(split[1]),
            outputId: split.slice(2).join(),
        };
    }
    else {
        throw new Error(`Unknown input type (${split[0]}).`);
    }
}
