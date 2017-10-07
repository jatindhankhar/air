echo "Restarting Server"
killall unicorn && unicorn -c unicorn.rb -E development -D
echo "Done :)"