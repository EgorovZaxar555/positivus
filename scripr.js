let accord_btn = document.getElementsByClassName('accordion');

for (i = 0; i < accord_btn.length; i++) {
    accord_btn[i].addEventListener('click', function() {
        this.classList.toggle('active');
    })
}
