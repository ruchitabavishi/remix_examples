import { emojis } from "~/constants";

export function getEmoji() {
    return emojis[Math.floor(Math.random() * (emojis.length))]
}

export function debounce(func: Function, wait: number) {
    var timeout: NodeJS.Timeout | null = null
    return function() {
        var context = this;
        var args = arguments;
        if(timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    }
}