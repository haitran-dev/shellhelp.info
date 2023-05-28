import { InvalidTokenError } from './utils/error';
interface Token {
	indices: [number, number]; // [start, end] end is exclusive
	value: string;
}

interface SpecToken extends Token, Fig.Suggestion {
	// type: 'command' | 'subcommand' | 'option' | 'argument' | 'unknown';
	error?: InvalidTokenError;
}
