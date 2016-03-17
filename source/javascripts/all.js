$(function() {
  var repos = {};
  $.get('https://api.github.com/search/repositories?per_page=20&page=1&q=user:ind9&sort=stars', function(data) {
    if(!data) return;

    data.items.forEach(function(repo) {
      repos[repo.name] = {
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks
      }
    });

    console.log(repos);
  });
});
