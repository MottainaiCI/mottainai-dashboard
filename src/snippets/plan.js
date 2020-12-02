export const planYmlSnippet = `\
# Task name
name: "docker hello world"

# Image used by the task player
image: "ubuntu:latest"

# Script to be executed
script:
  - echo "hello world"

# Task type
type: docker
`
