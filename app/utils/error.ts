import { Token } from 'types';

export class InvalidTokenError extends Error {
	constructor(public token: Token, public description: string) {
		super(`${description}: ${token.value}`);
	}
}
