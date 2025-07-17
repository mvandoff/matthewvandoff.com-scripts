/* Site */

import { IModule, Page } from '@sygnal/sse';
import { initMainNav } from './head-scripts/initMainNav';
import { initMobileNav } from './head-scripts/initMobileNav';
import gsap from 'gsap';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';

import siteCss from 'inline:./site.css';

export class Site implements IModule {
	constructor() {}

	/**
	 * Setup code runs synchronously, inline, at the end of the </head>.
	 * It's used for special init tasks that must be performed early, and which do not require
	 * the DOM to be loaded.
	 */
	setup() {
		document.head.insertAdjacentHTML('beforeend', `<style>${siteCss}</style>`);

		gsap.registerPlugin(ScrambleTextPlugin);
	}

	/** Exec code runs after the DOM has processed. */
	exec() {
		// Put your site-level custom code here
		// it will have full access to the DOM
		console.log('exec()');

		initMainNav();
		initMobileNav();
	}
}
