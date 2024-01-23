const cards = document.querySelectorAll(".equip-card");

cards.forEach(card => {
    card.addEventListener('mouseover', function(event){
        const img = card.querySelector('.card-img img');
        const title = card.querySelector('.card-info .card-title');

        // Установка прозрачности картинки
        img.style.opacity = 1;

        // Добавление подчеркивания к заголовку
        title.style.textDecoration = 'underline';
    });

    card.addEventListener('mouseout', function(event){
        const img = card.querySelector('.card-img img');
        const title = card.querySelector('.card-info .card-title');

        // Возврат прозрачности картинки к исходному состоянию
        img.style.opacity = 0.6;

        // Удаление подчеркивания у заголовка
        title.style.textDecoration = 'none';
    });
});
