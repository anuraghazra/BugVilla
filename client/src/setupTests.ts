// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import MutationObserver from 'mutation-observer';
import registerFaIcons from './fontLib';

global.MutationObserver = MutationObserver;
registerFaIcons();
