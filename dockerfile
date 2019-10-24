FROM joerversonsantos/yarn:0.0.2

WORKDIR /home/web

COPY . .

RUN mkdir build && yarn install && yarn build

EXPOSE 5000

CMD [ "/node_modules/serve/bin/serve.js", "-s", "build" ]
