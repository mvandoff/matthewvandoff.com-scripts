// Define default values that are used if no attributes other than [data-grid] are used
const defaults: GridDefaults = {
	gridBackground: 'transparent',
	gridSizeDesktop: 35,
	gridSizeMobile: 8,
	gridBorderSize: 2,
	gridBorderColor: 'rgba(0, 0, 0, 0.2)',
	gridColors: ['#009dfd', '#008ee3', '#006eb1', '#004e7e', '#002f4b'],
};

export function initGrids() {
	const target = document.getElementById('main-grid') as HTMLDivElement;
	if (target) initGrid(target);
}

function initGrid(el: HTMLDivElement) {
	const gridBackground = el.getAttribute('data-grid-background') ?? defaults.gridBackground;
	const gridSizeDesktop = parseInt(el.getAttribute('data-grid-size-desktop') ?? '') || defaults.gridSizeDesktop;
	const gridSizeMobile = parseInt(el.getAttribute('data-grid-size-mobile') ?? '') || defaults.gridSizeMobile;
	const gridBorderSize = parseFloat(el.getAttribute('data-grid-border-size') ?? '') || defaults.gridBorderSize;
	const gridBorderColor = el.getAttribute('data-grid-border-color') ?? defaults.gridBorderColor;

	// Parse grid colors so you can use HEX or RGBA values in the attribute
	let gridColors = defaults.gridColors;
	// const attrColors = el.getAttribute('data-grid-colors');
	// if (attrColors) {
	// 	try {
	// 		gridColors = JSON.parse(attrColors);
	// 	} catch (e) {
	// 		try {
	// 			gridColors = JSON.parse(attrColors.replace(/'/g, '"'));
	// 		} catch (e2) {
	// 			gridColors = defaults.gridColors;
	// 		}
	// 	}
	// }

	el.style.backgroundColor = gridBackground;
	const canvas = document.createElement('canvas');
	el.appendChild(canvas);
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		console.error('Could not get 2D context from canvas');
		return;
	}

	let cols: number;
	let rows: number;
	let squareSize: number;
	let blocks: Block[] = [];
	let lastHoveredIndex: number | null = null;

	// Generate the actual grid
	function setupGrid() {
		canvas.width = el.offsetWidth;
		canvas.height = el.offsetHeight;
		cols = window.innerWidth < 768 ? gridSizeMobile : gridSizeDesktop;
		squareSize = canvas.width / cols;
		rows = Math.ceil(canvas.height / squareSize);
		blocks = [];
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				blocks.push({ x: x * squareSize, y: y * squareSize, color: 'white', alpha: 0 });
			}
		}
	}

	// Draw the squares
	function draw() {
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		blocks.forEach((block: Block) => {
			ctx.fillStyle = block.color;
			ctx.globalAlpha = block.alpha;
			ctx.fillRect(block.x, block.y, squareSize, squareSize);
			ctx.globalAlpha = 1;
			ctx.strokeStyle = gridBorderColor;
			ctx.lineWidth = gridBorderSize;
			ctx.strokeRect(block.x, block.y, squareSize, squareSize);
		});
		requestAnimationFrame(draw);
	}

	// Define how long it takes for blocks to fade out
	function fadeOut(block: Block) {
		gsap.to(block, { alpha: 0, duration: 2, delay: 0.5 });
	}

	function supportsTouch() {
		return 'ontouchstart' in window || navigator.maxTouchPoints;
	}

	// Init mousemove listener if we're NOT on a touchscreen
	if (!supportsTouch()) {
		canvas.addEventListener('mousemove', (event) => {
			const rect = canvas.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;
			const hoveredIndex = blocks.findIndex(
				(block) =>
					mouseX >= block.x && mouseX < block.x + squareSize && mouseY >= block.y && mouseY < block.y + squareSize
			);
			if (hoveredIndex !== -1 && hoveredIndex !== lastHoveredIndex) {
				const block = blocks[hoveredIndex];
				block.color = gridColors[Math.floor(Math.random() * gridColors.length)];

				// Define duration of fade in animation
				gsap.to(block, { alpha: 1, duration: 0, overwrite: true });

				// Start fade out
				fadeOut(block);
				lastHoveredIndex = hoveredIndex;
			}
		});
	}

	window.addEventListener('resize', debounce(setupGrid, 200));

	setupGrid();
	draw();
}
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
	let timeout: number | undefined;
	return function (this: any, ...args: Parameters<T>) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
}

interface Block {
	x: number;
	y: number;
	color: string;
	alpha: number;
}

interface GridDefaults {
	gridBackground: string;
	gridSizeDesktop: number;
	gridSizeMobile: number;
	gridBorderSize: number;
	gridBorderColor: string;
	gridColors: string[];
}
