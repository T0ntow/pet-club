import type { MaskitoOptions } from '@maskito/core';

export const maskitoCNPJ: MaskitoOptions = {
    // Máscara CNPJ com pontos, barra e dígito verificador
    mask: [
        /\d/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '/',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
    ],  // Plugin para feedback visual de rejeição
    plugins: [
        element => {
            const listener = (): void => {
                const value = element.value;

                element.addEventListener(
                    'beforeinput',
                    event => {
                        if (event.defaultPrevented && value === element.value) {
                            element.dispatchEvent(
                                new CustomEvent('maskitoReject', { bubbles: true }),
                            );
                        }
                    },
                    { once: true },
                );
            };

            element.addEventListener('beforeinput', listener, true);

            return () => element.removeEventListener('beforeinput', listener, true);
        },
    ],
};


export const maskitoNumber: MaskitoOptions = {
    // Máscara CNPJ com pontos, barra e dígito verificador
    mask: [
        '(',
        /\d/,
        /\d/,
        ')',
        ' ',
        /\d/,
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
    ], 
    
    plugins: [
        element => {
            const listener = (): void => {
                const value = element.value;

                element.addEventListener(
                    'beforeinput',
                    event => {
                        if (event.defaultPrevented && value === element.value) {
                            element.dispatchEvent(
                                new CustomEvent('maskitoReject', { bubbles: true }),
                            );
                        }
                    },
                    { once: true },
                );
            };

            element.addEventListener('beforeinput', listener, true);

            return () => element.removeEventListener('beforeinput', listener, true);
        },
    ],
};
