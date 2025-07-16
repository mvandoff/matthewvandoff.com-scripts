import gsap from 'gsap';

function scrambleMobileMenu() {
	gsap.to('.mobile-menu .nav-link', {
		duration: 1,
		scrambleText: {
			text: '{original}',
			chars: '10',
			speed: 1,
			delimiter: ' ',
		},
	});
}

function setMenuBtnTrigger() {
	const menuBtn = document.getElementById('menu-btn') as HTMLButtonElement;
	menuBtn.classList.add('closed');
	menuBtn.addEventListener('click', (e) => {
		const target = e.target as HTMLButtonElement;
		if (target.classList.contains('closed')) {
			scrambleMobileMenu();
			target.textContent = '[ close ]';
			target.classList.replace('closed', 'open');
		} else {
			target.textContent = '[ menu ]';
			target.classList.replace('open', 'closed');
		}
	});
}

export function initMobileNav() {
	setMenuBtnTrigger();
}
