FROM node:20-alpine

WORKDIR /app

EXPOSE 3000

# Dependencies are installed at runtime into the bind-mounted project dir
# (see the `command` in docker-compose.yml), so node_modules is shared with the host.
CMD ["npm", "run", "dev"]
