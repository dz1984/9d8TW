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
            $bounds = Input::get('bounds');

            $mockPullList = array(
                'status' => 'OK',
                'message' => $bounds,
                'pulls' => array(
                    array(
                        'lat' => 25.0294008,
                        'lng' => 121.5216733,
                        'id' => md5(rand())
                    ),
                    array(
                        'lat' => 25.0175019,
                        'lng' => 121.5218866,
                        'id' => md5(rand())
                    )
                )
            );
            return Response::json($mockPullList);            
        }
    }

    public function postAdd(){
        if (Request::ajax()){

        }
    }
}