<?php
use Illuminate\Database\Eloquent\SoftDeletingTrait;

class Pull extends Eloquent {
    
    use SoftDeletingTrait;

    public function confides() {
        return $this->hasMany('Confide')
            ->select(array('content'));
    }
}