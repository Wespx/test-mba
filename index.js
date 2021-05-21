const accordion = () => {
    const breakpoint = window.matchMedia('(max-width: 767px)');
    
    const showHideAccordionItem = e => {
        const target = e.target;

        if (target.classList.contains('modules__title')) {
            const li = target.closest('.modules__item');
            const list = li.querySelector('.modules__list');
            const listHeight = list.style.height;

            li.classList.toggle('modules__item_active');
            list.style.height = listHeight ? '' : `${list.scrollHeight}px`;
        }
    };

    const setAccordionState = e => {
        //поскольку аккордеон есть только в мобильной версии,
        //в десктопе события клика не прослушиваются, а высота modules__list становится автоматической
        if (e.matches) {
            document.addEventListener('click', showHideAccordionItem);
        } else {
            const activeItems = document.querySelectorAll('.modules__item_active');

            activeItems.forEach(item => {
                const list = item.querySelector('.modules__list');
                
                item.classList.remove('modules__item_active');
                list.style.height = '';
            });

            document.removeEventListener('click', showHideAccordionItem);
        }
    };

    if (breakpoint.matches) document.addEventListener('click', showHideAccordionItem);
    breakpoint.addEventListener('change', setAccordionState);
};

const handlePrograms = () => {
    
    const renderPrograms = programs => {
        const container = document.querySelector('.discipline-container');
        
        programs.forEach(item => {
            let module1 = '';
            let module2 = '';

            item.subjects.forEach((subj, i) => {
                li = `<li class="modules__list-item">${subj}</li>`;
                
                if (i < 5) {
                    module1 += li;
                } else {
                    module2 += li;
                }
            });

            container.insertAdjacentHTML('beforeend', `
                <section class="discipline">
                    <h2 class="discipline__title">${item.title}</h2>

                    <ul class="discipline__modules modules">
                        <li class="modules__item">
                            <h3 class="modules__title">1 модуль</h3>

                            <ul class="modules__list">${module1}</ul>
                        </li>

                        <li class="modules__item">
                            <h3 class="modules__title">2 модуль</h3>

                            <ul class="modules__list">${module2}</ul>
                        </li>
                    </ul>
                </section>
            `)
        });
    };
    
    const fillPrograms = data => {
        const programs = [];

        for (const item of data) {
            //Выбираем из массива данных 5 программ с уникальным названием и 10 предметами
            if (!programs.some(program => program.title === item.title) &&
            item.specializedSubjects.length === 10) {
                const program = {title: item.title, subjects: item.specializedSubjects};
                programs.push(program);
            }

            if (programs.length === 5) break;
        }

        renderPrograms(programs);
    };
    
    const getData = () => {
        const url = 'https://ipo-cp.ru/api/v1/bootcamps/605c5f71bc557b46b4f42a56/courses';
    
        fetch(url)
        .then(response => {
            if (response.status !== 200) {
                throw new Error('Status: not 200');
            } else {
                return response.json();
            }
        })
        .then(response => fillPrograms(response.data))
        .catch(error => {
            console.error(error);
            alert('Ошибка загрузки данных');
        });
    };

    getData();
};

accordion();
handlePrograms();