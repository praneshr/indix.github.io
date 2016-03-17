$(function() {
  $.get('https://api.github.com/search/repositories?per_page=20&page=1&q=user:ind9&sort=stars', function(data) {
    if(!data) return;

    data.items.forEach(function(repo) {
      var repoContainer = $('#' + repo.name);
      if(repoContainer.length > 0) {
        repoContainer.attr('href', repo.url);
        var description = $('<p>').text(repo.description);
        $('.panel-body', repoContainer).append(description);
        $('.language', repoContainer).text(repo.language);
        $('.stars', repoContainer).text(repo.stargazers_count);
        $('.forks', repoContainer).text(repo.forks);
      }
    });
  });
});
