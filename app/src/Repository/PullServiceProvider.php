<?php namespace Repository;

use Confide;
use Illuminate\Support\ServiceProvider;
use Pull;

class PullServiceProvider extends ServiceProvider {

	public function register()
	{
		$this->app->bind('Repository\IPullRepository', function ()
		{
			return new PullRepository(new Pull, new Confide);
		});
	}
}