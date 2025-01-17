# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.7.5'
gem 'rails-i18n', '~> 7.0.3'
gem 'react-rails', '~> 2.6', '>= 2.6.2'
gem 'pg', '~> 1.3.5'
gem 'sorcery', '~> 0.16.1'
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails', branch: 'main'
gem 'rails', '~> 6.1.5'
# Use Puma as the app server
gem 'puma', '~> 5.0'
# Use SCSS for stylesheets
gem 'sass-rails', '>= 6'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker', '~> 5.0'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.7'
# Use Redis adapter to run Action Cable in production
gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'
gem 'will_paginate', '~> 3.3.0'
gem 'dotenv-rails', '~> 2.7', '>= 2.7.6'
gem "font_awesome5_rails", "~> 1.5"
# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]
gem "pundit", "~> 2.2"
gem "aasm", "~> 5.2"
gem "sidekiq", "~> 6.4"
# Use Active Storage variant
gem 'image_processing', '~> 1.12', '>= 1.12.2'
# gem 'ruby-vips', '~> 2.1', '>= 2.1.4'
# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.4', require: false
gem 'twilio-ruby', '~> 5.67'
gem 'simple_form', '~> 5.1'
gem 'faker', '~> 2.21'
gem 'validates_timeliness', '~> 6.0.0.beta2'
gem 'elasticsearch', '~> 6.0'
gem 'searchkick', '~> 5.0.1', '>= 5.0.3'
gem "aws-sdk-s3", require: false
gem 'twilio_client', '~> 0.0.1'
gem 'friendly_id', '~> 5.4', '>= 5.4.2'
group :development, :test do
  gem 'byebug', platforms: %i[mri mingw x64_mingw]
  gem 'foreman', '~> 0.87.2'
  gem 'rubocop', '~> 1.28', require: false
  gem 'rspec', '~> 3.11'
  gem 'rspec-rails'
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  # gem 'bullet', '~> 6.1'
  gem 'web-console', '>= 4.1.0'
  # gem 'rack-mini-profiler', '~> 2.0'
  gem 'listen', '~> 3.3'
  gem 'spring'
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '>= 3.26'
  gem 'selenium-webdriver', '>= 4.0.0.rc1'
  # Easy installation and use of web drivers to run system tests with browsers
  gem 'webdrivers'
end
