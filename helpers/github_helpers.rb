module GithubHelpers

  @@contributors = {}
  
  require 'date'
  def self.week_start(date, offset_from_sunday = 0)
    date - (date.wday - offset_from_sunday) % 7
  end
  
  def self.date_unix_timestamp(date)
    date.to_time.utc.to_i / 86400 * 86400
  end
  
  @@week_timestamp = date_unix_timestamp(week_start(DateTime.now.new_offset(0)))
  puts "Current week timestamp #{@@week_timestamp}"

  def week_contribution(weeks)
    contribution = weeks.find { |w| w.w == @@week_timestamp }
    contribution ? contribution.c : 0
  end
  
  def build_contributors(repo)
    return unless config[:github_auth]
    puts "Building contributors info for #{repo}"

    @@github = Github.new basic_auth: config[:github_auth]
    @@repo_contributors = @@github.repos.stats.contributors 'indix', repo
    @@repo_contributors.each { |contributor|
      puts "#{contributor.author.login} (#{contributor.total})"
      if @@contributors.key?(contributor.author.login)
        @@contributors[contributor.author.login][:contributions] += contributor.total
        @@contributors[contributor.author.login][:contributions_week] += week_contribution(contributor.weeks)
      else
        @@contributors[contributor.author.login] = {
          :contributions => contributor.total,
          :html_url => contributor.author.html_url,
          :avatar_url => contributor.author.avatar_url,
          :contributions_week => week_contribution(contributor.weeks)
        }
      end
    }
  end
  
  def contributors
    @@contributors
  end
  
  def contributor_of_week
    @@contributor_of_week = @@contributors.max_by { |k, v| v[:contributions_week] }
    @@contributor_of_week
  end

  def is_client_side
    config[:github_auth] == false
  end
end
