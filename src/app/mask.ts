import type { MaskitoOptions } from '@maskito/core';

export const maskitoCNPJ: MaskitoOptions = {
    mask: [
        /\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'/',/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,
    ],
};

export const maskitoNumber: MaskitoOptions = {
    mask: [
        '(',/\d/,/\d/,')',' ',/\d/,' ',/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/,
    ], 
};
