#!/bin/bash
# Run test for multiple ENV's

baseURLs=(
  "https://www.ploom.co.uk/en"
  "https://www.ploom.pl/pl"
  )

for url in "${baseURLs[@]}"
do
  echo "Tests are running on env: $url"

  #Extract env name from URL
  envNameFromURL=$(echo "$url" | awk -F '//' '{split($2, a, "-"); print a[1]}')

  #Run test on given URL
  ENV_NAME=$envNameFromURL BASE_URL=$url npx playwright test

  #Save the reporting
  new_folder_name="report-${envNameFromURL}"
  mv "playwright-report" "reporting/${new_folder_name}"
done
