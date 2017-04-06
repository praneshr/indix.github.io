page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

configure :development do
  activate :livereload
end

activate :bh

activate :google_analytics do |ga|
  ga.tracking_id = 'UA-29521335-1'
  ga.minify = true
end

config[:github_auth] = ENV['GITHUB_AUTH'] || false

# Build-specific configuration
configure :build do
  activate :minify_css
  activate :minify_javascript
end
