fetch('../footer/footer.html')
    .then(function(response) {
        return response.text()
    })
    .then(function(html) {
        document.getElementById('footer-container').innerHTML = html
    })