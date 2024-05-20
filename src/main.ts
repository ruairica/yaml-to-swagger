import assert from 'assert'; // sample import from node modules
import { hey } from './helper.js'; // sample import for local files since we're using NodeNext, include .js extension

assert(true, 'does not print');
console.log(hey);
