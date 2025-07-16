export function initMainNav() {
	const nav = document.querySelector('#main-nav');
	const navItems = nav?.querySelectorAll('a');

	navItems?.forEach((navItem) => {
		navItem.addEventListener('mouseenter', (e) => {
			const hoveredEle = e.target as HTMLAnchorElement;
			if (hoveredEle && !hoveredEle.classList.contains('w--current')) {
				navItems.forEach((ele) => {
					if (ele !== hoveredEle) ele.classList.add('inactive');
				});
			}
		});

		navItem.addEventListener('mouseleave', (e) => {
			navItems.forEach((ele) => ele.classList.remove('inactive', 'active'));
		});
	});
}
