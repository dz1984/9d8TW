<?php

class BaseController extends Controller {

  protected $layout  = 'layouts.default';

  public function __construct() {
     
  }

	protected function setupLayout() {
		if (!is_null($this->layout)) {
			$this->layout = View::make($this->layout);
		}
	}

  protected function view($path, $data = array()) {
    $this->layout->content = View::make($path, $data);
  }

  protected function json($data = array()) {
    $this->layout = null;
    return Response::json($data);
  }
}