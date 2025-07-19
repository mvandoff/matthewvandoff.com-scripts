/* Page | Home */

import { IModule } from '@sygnal/sse';
import { initGrids } from './scripts/grid';

export class HomePage implements IModule {
	constructor() {}

	setup() {}

	exec() {
		initGrids();
	}
}
