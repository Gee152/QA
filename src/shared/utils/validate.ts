/**
 * Verifica se uma string está vazia, nula ou indefinida.
 */
export function checkStringEmpty(value: string | null | undefined): boolean {
    return !value || value.trim().length === 0
}

/**
 * Verifica se um número é inválido: nulo, indefinido ou NaN.
 */
export function checkNumberEmpty(value: number | null | undefined): boolean {
    return value === null || value === undefined || isNaN(value)
}

/**
 * Verifica se um número está fora de um range mínimo e máximo (inclusive).
 */
export function checkNumberRange(value: number, min: number, max: number): boolean {
    return value < min || value > max
}

/**
 * Verifica se um enum string é válido dentro de um conjunto de valores permitidos.
 */
export function checkEnumValue<T extends string>(value: string, allowed: T[]): boolean {
    return !allowed.includes(value as T)
}

/**
 * Verifica se uma string tem formato de UUID v4 válido.
 */
export function checkUUID(value: string): boolean {
    if (checkStringEmpty(value)) return true
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return !uuidRegex.test(value)
}

/**
 * Verifica se uma string tem formato de e-mail válido.
 */
export function checkEmail(value: string): boolean {
    if (checkStringEmpty(value)) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return !emailRegex.test(value)
}
