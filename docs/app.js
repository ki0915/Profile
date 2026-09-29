const buttons = document.querySelectorAll('.filter-button');
const cards = document.querySelectorAll('.archive-card');

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    buttons.forEach((item) => item.classList.toggle('active', item === button));
    buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));

    cards.forEach((card) => {
      const categories = card.dataset.category.split(' ');
      card.hidden = selected !== 'all' && !categories.includes(selected);
    });
  });
});

buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === 0)));
document.querySelector('#year').textContent = new Date().getFullYear();
