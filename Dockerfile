FROM clojure
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN lein deps
EXPOSE 3000
RUN mv "$(lein uberjar | sed -n 's/^Created \(.*standalone\.jar\)/\1/p')" app-standalone.jar
CMD ["java", "-jar", "app-standalone.jar"]