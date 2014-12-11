<?php

class PullController extends BaseController {
    public function __construct() {
        parent::__construct();
    }

    public function getIndex() {
        return View::make('pull.index');
    }
    
    public function getAll() {
        if (Request::ajax()){

        }
    }

    public function postAdd(){
        if (Request::ajax()){

        }
    }
}