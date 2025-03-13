// NOTE: This is from hono's built-in logger 
export const humanize = (times: any[]) => {
    const [delimiter, separator] = [",", "."];
    const orderTimes = times.map((v: string) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${delimiter}`));
    return orderTimes.join(separator);
};
export const time = (start: number) => {
    const delta = Date.now() - start;
    return humanize([delta < 1e3 ? `${delta}ms` : `${Math.round(delta / 1e3)}s`]);
};