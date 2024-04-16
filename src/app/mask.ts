import type { MaskitoOptions } from '@maskito/core';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';

export const maskitoCNPJ: MaskitoOptions = {
    mask: [/\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'/',/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/],
};

export const maskitoNumber: MaskitoOptions = {
    mask: ['(',/\d/,/\d/,')',' ',/\d/,' ',/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/], 
};


export const maskitoCPF: MaskitoOptions = {
    mask: [/\d/,/\d/,/\d/,'.', /\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'-',/\d/,/\d/], 
};
maskitoNumber
export const maskitoPrice =  maskitoNumberOptionsGenerator({
    decimalZeroPadding: true,
    precision: 2,
    decimalSeparator: '.',
    min: 0,
    prefix: 'R$',
});
