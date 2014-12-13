<?php
use Illuminate\Database\Eloquent\SoftDeletingTrait;

class Pull extends Eloquent {
    
    use SoftDeletingTrait;


    public function confides() {
        return $this->hasMany('Confide','pull_id')
                ->select(array('pull_id','content'));
    }
}