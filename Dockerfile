# use node 16 alpine image
FROM node:16-alpine

# create work directory in app folder
COPY . /app
WORKDIR /app

# install all depencies
RUN npm i

# generate types
RUN npm run prisma-generate

RUN npm run db_push

# copy over all files to the work directory
ADD . /app

# build the project
RUN npm run build

# expose the host and port 1920 to the server
ENV HOST 0.0.0.0
EXPOSE 1920

# run the build project with node
ENTRYPOINT ["node", ".output/server/index.mjs"]